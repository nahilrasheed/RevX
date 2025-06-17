-- Function: get_project_with_details
CREATE OR REPLACE FUNCTION get_project_with_details(project_id integer)
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    result json;
BEGIN
    SELECT 
        json_build_object(
            'id', p.id,
            'created_at', p.created_at,
            'title', p.title,
            'description', p.description,
            'owner_id', p.owner_id,
            'owner', (
                SELECT json_build_object(
                    'id', prof.id, 
                    'username', prof.username, 
                    'full_name', prof.full_name, 
                    'bio', prof.bio, 
                    'avatar', prof.avatar
                )
                FROM revx.profile prof WHERE prof.id = p.owner_id
            ),
            'contributors', (
                SELECT coalesce(json_agg(
                    json_build_object(
                        'id', c.id,
                        'created_at', c.created_at,
                        'user_id', c.user_id,
                        'project_id', c.project_id,
                        'status', c.status,
                        'username', prof.username,
                        'avatar', prof.avatar,
                        'full_name', prof.full_name
                    )
                ), '[]'::json)
                FROM revx.contributors c
                LEFT JOIN revx.profile prof ON prof.id = c.user_id
                WHERE c.project_id = p.id
            ),
            'reviews', (
                SELECT coalesce(json_agg(
                    json_build_object(
                        'id', r.id,
                        'created_at', r.created_at,
                        'project_id', r.project_id,
                        'user_id', r.user_id,
                        'rating', r.rating,
                        'review', r.review,
                        'username', prof.username,
                        'avatar', prof.avatar,
                        'full_name', prof.full_name
                    )
                ), '[]'::json)
                FROM revx.reviews r
                LEFT JOIN revx.profile prof ON prof.id = r.user_id
                WHERE r.project_id = p.id
            ),
            'images', (
                SELECT coalesce(json_agg(pi.image_link), '[]'::json)
                FROM revx.project_images pi
                WHERE pi.project_id = p.id
            ),
            'tags', (
                SELECT coalesce(json_agg(
                    json_build_object(
                        'tag_id', t.id,
                        'tag_name', t.tag_name
                    )
                ), '[]'::json)
                FROM "revx"."project_R_tag" pt  -- Notice the quoted identifiers for case-sensitivity
                JOIN revx.tags t ON pt.tag_id = t.id
                WHERE pt.project_id = p.id
            )
        ) INTO result
    FROM 
        revx.projects p
    WHERE 
        p.id = get_project_with_details.project_id;
    
    RETURN result;
END;
$$;

-- Function : get_user_projects_with_images
CREATE OR REPLACE FUNCTION get_user_projects_with_images(p_user_id uuid)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN QUERY
    WITH project_images AS (
        SELECT 
            p.id as project_id,
            json_agg(pi.image_link) FILTER (WHERE pi.image_link IS NOT NULL) as images
        FROM 
            revx.project_images pi
        RIGHT JOIN 
            revx.projects p ON p.id = pi.project_id
        WHERE 
            p.owner_id = user_id
        GROUP BY 
            p.id
    )
    SELECT 
        json_build_object(
            'id', p.id,
            'title', p.title,
            'description', p.description,
            'owner_id', p.owner_id,
            'created_at', p.created_at,
            'images', COALESCE(pi.images, '[]'::json),
            'tags', (
                SELECT coalesce(json_agg(
                    json_build_object(
                        'tag_id', t.id,
                        'tag_name', t.tag_name
                    )
                ), '[]'::json)
                FROM "revx"."project_R_tag" pt
                JOIN revx.tags t ON pt.tag_id = t.id
                WHERE pt.project_id = p.id
            )
        )
    FROM 
        revx.projects p
    LEFT JOIN 
        project_images pi ON p.id = pi.project_id
    WHERE 
        p.owner_id = user_id
    ORDER BY 
        p.created_at DESC, p.id;
END;
$$;

-- Function : get_user_reviews
CREATE OR REPLACE FUNCTION get_user_reviews(p_user_id uuid)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        json_build_object(
            'id', r.id,
            'review', r.review,
            'rating', r.rating,
            'created_at', r.created_at,
            'project', json_build_object(
                'id', p.id,
                'title', p.title,
                'description', p.description,
                'created_at', p.created_at
            ),
            'project_owner', json_build_object(
                'id', owner.id,
                'username', owner.username,
                'avatar', owner.avatar,
                'full_name', owner.full_name
            )
        )
    FROM 
        revx.reviews r
    JOIN 
        revx.projects p ON r.project_id = p.id
    JOIN
        revx.profile owner ON p.owner_id = owner.id
    WHERE 
        r.user_id = get_user_reviews.user_id
    ORDER BY 
        r.created_at DESC;
END;
$$;

-- Function : list_projects_with_details
CREATE OR REPLACE FUNCTION list_projects_with_details()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN QUERY
    SELECT json_agg(
        json_build_object(
            'id', p.id,
            'created_at', p.created_at,
            'title', p.title,
            'description', p.description,
            'owner_id', p.owner_id,
            'avg_rating', COALESCE(avg_rating, 0),  -- Include average rating in the response
            'owner', (
                SELECT json_build_object(
                    'id', prof.id, 
                    'username', prof.username, 
                    'full_name', prof.full_name, 
                    'bio', prof.bio, 
                    'avatar', prof.avatar
                )
                FROM revx.profile prof WHERE prof.id = p.owner_id
            ),
            'images', (
                SELECT coalesce(json_agg(pi.image_link), '[]'::json)
                FROM revx.project_images pi
                WHERE pi.project_id = p.id
            ),
            'tags', (
                SELECT coalesce(json_agg(
                    json_build_object(
                        'tag_id', t.id,
                        'tag_name', t.tag_name
                    )
                ), '[]'::json)
                FROM "revx"."project_R_tag" pt
                JOIN revx.tags t ON pt.tag_id = t.id
                WHERE pt.project_id = p.id
            )
        )
    )
    FROM (
        -- Subquery to calculate average ratings and order projects
        SELECT 
            p.id, 
            p.created_at, 
            p.title, 
            p.description, 
            p.owner_id,
            AVG(r.rating)::numeric(3,2) as avg_rating
        FROM 
            revx.projects p
        LEFT JOIN 
            revx.reviews r ON p.id = r.project_id
        GROUP BY 
            p.id, p.created_at, p.title, p.description, p.owner_id
        ORDER BY 
            -- Projects with ratings come first (DESC order), then projects with no ratings
            CASE WHEN AVG(r.rating) IS NULL THEN 0 ELSE 1 END DESC,
            AVG(r.rating) DESC,
            p.created_at DESC  -- Secondary sort by creation date (newest first)
    ) p;
END;
$$;